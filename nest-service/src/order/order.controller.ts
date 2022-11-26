import { Controller, Body, Req, Post, HttpStatus, HttpException } from '@nestjs/common';

import { OrderService } from '../order';
import { AppRequest } from '../shared';

@Controller('api/order')
export class OrderController {
  constructor(
    private orderService: OrderService
  ) { }

  @Post()
  async createOrder(@Req() req: AppRequest, @Body() body) {
    try {
        const order = await this.orderService.create(body);

        return {
            statusCode: HttpStatus.OK,
            message: 'OK',
            data: { order },
        }
    } catch (error) {
        throw new HttpException(
            `Internal Server Error: ${error}`,
            error.status || HttpStatus.INTERNAL_SERVER_ERROR
        )
    }
  }
}