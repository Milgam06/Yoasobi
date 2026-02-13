import { Global, Module } from '@nestjs/common';
import * as UtilServices from './services';

const Services = Object.values(UtilServices);

@Global()
@Module({ providers: [...Services], exports: [...Services] })
export class UtilModule {}
