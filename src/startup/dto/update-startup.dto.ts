import { PartialType } from "@nestjs/swagger";
import { createStartupDTO } from "./create-startup.dto";

export class UpdateStartupDTO extends PartialType(createStartupDTO) {}