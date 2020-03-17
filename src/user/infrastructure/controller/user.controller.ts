import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    HttpCode,
    NotFoundException,
    Post,
    Put,
    Query,
  } from '@nestjs/common';
  import { ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
  
  import {
    ScopeIdAlreadyRegisteredError,
    ScopeIdNotFoundError,
  } from '../../domain/exception';
  import {
    ScopeAliasAlreadyRegisteredError,
  } from '../../domain/exception/scope-alias-already-registered.error';
  import { RenameScopeDto, ScopeDto } from '../dto';
  import { ScopeView } from '../read-model/schema/scope.schema';
  import { ScopeService } from '../service/scope.service';


  
  
  @ApiUseTags('Scopes')
  @Controller('scopes')
  export class ScopeController {
    constructor(private readonly scopeService: ScopeService) {}
  
    @ApiOperation({ title: 'Get Scopes' })
    @ApiResponse({ status: 200, description: 'Get Scopes.' })
    @Get()
    async getScopes(): Promise<ScopeView[]> {
      return this.scopeService.getScopes();
    }
  
    @ApiOperation({ title: 'Create Scope' })
    @ApiResponse({ status: 204, description: 'Create Scope.' })
    @HttpCode(204)
    @Post()
    async createScope(@Body() scopeDto: ScopeDto): Promise<ScopeDto> {
      try {
        return await this.scopeService.createScope(
          scopeDto.id,
          scopeDto.name,
          scopeDto.alias,
        );
      } catch (e) {
        if (e instanceof ScopeIdAlreadyRegisteredError) {
          throw new ConflictException(e.message);
        } else if (e instanceof ScopeAliasAlreadyRegisteredError) {
          throw new ConflictException(e.message);
        } else if (e instanceof Error) {
          throw new BadRequestException(`Unexpected error: ${e.message}`);
        } else {
          throw new BadRequestException('Server error');
        }
      }
    }
  
    @ApiOperation({ title: 'Get Scope' })
    @ApiResponse({ status: 204, description: 'Get Scope.' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @Get(':id')
    async getScope(@Query('id') id: string): Promise<ScopeView> {
      try {
        return await this.scopeService.getScope(id);
      } catch (e) {
        if (e instanceof ScopeIdNotFoundError) {
          throw new NotFoundException('Scope not found');
        } else if (e instanceof Error) {
          throw new BadRequestException(`Unexpected error: ${e.message}`);
        } else {
          throw new BadRequestException('Server error');
        }
      }
    }
  
    @ApiOperation({ title: 'Rename Scope' })
    @ApiResponse({ status: 204, description: 'Rename scope' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @HttpCode(204)
    @Put(':id')
    async renameScope(@Query('id') id: string, @Body() scopeDto: RenameScopeDto) {
      try {
        return await this.scopeService.renameScope(id, scopeDto.name);
      } catch (e) {
        if (e instanceof ScopeIdNotFoundError) {
          throw new NotFoundException('Scope not found');
        } else if (e instanceof Error) {
          throw new BadRequestException(`Unexpected error: ${e.message}`);
        } else {
          throw new BadRequestException('Server error');
        }
      }
    }
  
    @ApiOperation({ title: 'Delete Scope' })
    @ApiResponse({ status: 204, description: 'Delete scope' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @HttpCode(204)
    @Delete(':id')
    async removeScope(@Query('id') id: string) {
      try {
        return await this.scopeService.removeScope(id);
      } catch (e) {
        if (e instanceof ScopeIdNotFoundError) {
          throw new NotFoundException('Scope not found');
        } else if (e instanceof Error) {
          throw new BadRequestException(`Unexpected error: ${e.message}`);
        } else {
          throw new BadRequestException('Server error');
        }
      }
    }
  }