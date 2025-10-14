import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StartupModule } from './startup/startup.module';
import { ChallengeModule } from './challenge/challenge.module';
import { CompaniesModule } from './companies/companies.module';
import { InvitationsModule } from './invitations/invitations.module';
import { POCModule } from './poc/poc.module';
import { ConnectionsModule } from './connections/connections.module';
import { IdeaModule } from './idea/idea.module';
import { CommentsModule } from './comments/comments.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, AuthModule, ChallengeModule, CompaniesModule, StartupModule, POCModule, InvitationsModule, ConnectionsModule, IdeaModule, CommentsModule, EvaluationsModule, UserModule],
  controllers: [],
  providers: [],
})


export class AppModule {}
