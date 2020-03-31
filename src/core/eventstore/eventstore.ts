import { Injectable } from '@nestjs/common';
import { IEvent, IEventPublisher, IMessageSource } from '@nestjs/cqrs';
import { TCPClient } from 'geteventstore-promise';
import * as http from 'http';
import { ConfigService } from 'nestjs-config';
import { Subject } from 'rxjs';

import { AggregateRoot } from '../domain/models/aggregate-root';

/**
 * @class EventStore
 * @description The EventStore.org bridge. By design, the domain category
 * (i.e. user) events are being subscribed to. Upon events being received,
 * internal event handlers are responsible for the handling of events.
 */
@Injectable()
export class EventStore implements IEventPublisher, IMessageSource {
  private _category: string;
  private _eventHandlers: object;
  private _eventStoreHostUrl: string;

  constructor(config: ConfigService, private readonly client: TCPClient) {
    this._category = 'iam';
    this._eventStoreHostUrl =
      config.get('eventstore').protocol +
      `://${config.get('eventstore').hostname}:${
        config.get('eventstore').httpPort
      }/streams/`;
  }

  async publish<T extends IEvent>(event: T) {
    if ('id' in event === false) {
      throw new Error('Not a DomainEvent');
    }

    const message = JSON.parse(JSON.stringify(event));
    const id = message.id;
    const streamName = `${this._category}-${id}`;
    const type = event.constructor.name;
    const metadata = {
      _aggregate_id: id,
      _ocurred_on: new Date().getTime(),
    };

    try {
      await this.client.writeEvent(streamName, type, event, metadata);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.trace(err);
    }
  }

  async read<T extends AggregateRoot>(
    aggregate: Function,
    id: string,
  ): Promise<T> | null {
    const streamName = `${this._category}-${id}`;

    try {
      const entity = Reflect.construct(aggregate, []);
      const response = await this.client.getEvents(streamName);

      const events = response.map(event => {
        const eventType = event.eventType;
        const data = event.data;

        return this._eventHandlers[eventType](...Object.values(data));
      });

      if (events.length === 0) {
        return null;
      }

      entity.loadFromHistory(events);

      return entity;
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.trace(err);
    }

    return null;
  }

  /**
   * @description Event Store bridge subscribes to domain category stream
   * @param subject
   */
  async bridgeEventsTo<T extends IEvent>(subject: Subject<T>) {
    const streamName = `$ce-${this._category}`;

    const onEvent = async event => {
      const eventUrl =
        this._eventStoreHostUrl +
        `${event.metadata.$o}/${event.data.split('@')[0]}`;

      const requestOptions: http.RequestOptions = {
        headers: {
          Accept: 'application/vnd.eventstore.atom+json',
        },
      };

      http.get(eventUrl, requestOptions, res => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', chunk => {
          rawData += chunk;
        });
        res.on('end', () => {
          const message = JSON.parse(rawData);

          const eventType = message.content.eventType;
          const data = message.content.data;
          event = this._eventHandlers[eventType](...Object.values(data));

          subject.next(event);
        });
      });
    };

    const onDropped = (subscription, reason, error) => {
      // tslint:disable-next-line:no-console
      console.trace(subscription, reason, error);
    };

    try {
      await this.client.subscribeToStream(
        streamName,
        onEvent,
        onDropped,
        false,
      );
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.trace(err);
    }
  }

  addEventHandlers(eventHandlers) {
    this._eventHandlers = {
      ...this._eventHandlers,
      ...eventHandlers,
    };
  }
}
