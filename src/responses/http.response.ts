import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class HttpResponse {
  createdResponse(res: Response, message: string, data: any) {
    return res.status(HttpStatus.CREATED).json({
      success: true,
      statusCode: HttpStatus.CREATED,
      message,
      data,
    });
  }

  okResponse(res: Response, message: string, data: any) {
    return res.status(HttpStatus.OK).json({
      success: true,
      statusCode: HttpStatus.OK,
      message,
      data,
    });
  }

  noContentResponse(res: Response, message: string, data: any) {
    return res.status(HttpStatus.NO_CONTENT).json({
      success: true,
      statusCode: HttpStatus.NO_CONTENT,
    });
  }

  okResponseGeneric<T>(res: Response, message: string, data: T) {
    return res.status(HttpStatus.OK).json({
      success: true,
      statusCode: HttpStatus.OK,
      message,
      ...data,
    });
  }
}
