import { PartialType } from "@nestjs/swagger";
import { CreatePOCdto } from "./create-poc.dto";

export class UpdatePocDTO extends PartialType(CreatePOCdto) {}