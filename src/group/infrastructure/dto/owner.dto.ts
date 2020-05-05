export class OwnerDto {
  readonly _id: string;
  readonly name: string;

  constructor(id: string, name: string) {
    this._id = id;
    this.name = name;
  }
}
