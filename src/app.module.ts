import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TweetModule } from './tweet/tweet.module';

@Module({
  imports: [UserModule, TweetModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
