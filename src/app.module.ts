import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TweetModule } from './tweet/tweet.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TweetModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
