import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ComumGuard } from "./comum-auth.guard";
import { AvaliadorGuard } from "./avaliador-auth.guard";
import { GestorGuard } from "./gestor-auth.guard";

@Injectable()
export class RolesOrGuard implements CanActivate {
    constructor(
        private readonly comumGuard: ComumGuard,
        private readonly avaliadorGuard: AvaliadorGuard,
        private readonly gestorGuard: GestorGuard
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        return (
            (await this.comumGuard.canActivate(context)) ||
            (await this.avaliadorGuard.canActivate(context)) ||
            (await this.gestorGuard.canActivate(context))
        );
    }
}