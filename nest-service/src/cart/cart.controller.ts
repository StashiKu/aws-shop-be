import { Controller, Get, Delete, Put, Body, Req, Post, HttpStatus, HttpException } from '@nestjs/common';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { CartService } from './services';

@Controller('api/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  @Get()
  async findUserCart(@Req() req: AppRequest) {
    try {
      const cart = await this.cartService.findByUserId(getUserIdFromRequest(req));

      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: { cart },
      }
    } catch (err) {
      throw new HttpException(
        `Internal Server Error: ${err}`,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) { // TODO: validate body payload...
    const userId = body.user.id;
    const items = body.item;
    try {
      const cart = await this.cartService.updateByUserId(userId, items)
  
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
          cart,
          total: 'total'
        }
      }
    } catch (err) {
      console.log(err)
      throw new HttpException(
        `Internal Server Error: ${err}`,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post()
  async createUserCart(@Req() req: AppRequest, @Body() body) {
    const user = body.user;
    const cartItem = body.cartItem;
    try {
      const res = await this.cartService.createUserCart(user, cartItem);
  
      return {
        statusCode: HttpStatus.OK,
        message: 'Cart with items is created',
        data: res
      }
    } catch (err) {
      throw new HttpException(
        `Internal Server Error: ${err}`,
        err.status || HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Delete()
  clearUserCart(@Req() req: AppRequest) {
    this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    }
  }

  @Post('checkout')
  async checkout(@Req() req: AppRequest, @Body() body) {
    const userId = getUserIdFromRequest(req);
    const cart = await this.cartService.findByUserId(userId);

    if (!(cart && cart[0].items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const { ID: cartId, items } = cart[0];
    // const total = calculateCartTotal(cart[0]);
    const order = this.orderService.create({
      ...body, // TODO: validate and pick only necessary data
      userId,
      cartId,
      items,
      // total,
    });
    this.cartService.removeByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order }
    }
  }
}
