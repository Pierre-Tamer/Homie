import { Controller, Get, Param, Res } from '@nestjs/common';

import { Response } from 'express';

import { PhotoService } from './photo.service';

@Controller('photo')
export class PhotoController {
  constructor(private photoService: PhotoService) {}

  @Get('/:name')
  async getPhoto(@Param('name') name: string, @Res() res: Response) {
    return await this.photoService.getPhoto(name, res);
  }
}
