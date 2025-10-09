import { PartialType } from "@nestjs/swagger";
import { CreateConnectionsDTO } from "./create-connections.dto";

export class UpdateConnectionDTO extends PartialType(CreateConnectionsDTO) {}