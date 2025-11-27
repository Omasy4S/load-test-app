import { Controller, Get, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { GetItemsDto } from './dto/get-items.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(@Query() query: GetItemsDto) {
    const items = await this.itemsService.findAll(query.limit, query.offset);
    return {
      data: items,
      meta: {
        limit: query.limit,
        offset: query.offset,
        count: items.length,
      },
    };
  }

  @Get('count')
  async count() {
    const total = await this.itemsService.count();
    return { total };
  }
}
