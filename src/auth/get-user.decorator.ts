import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {User} from "./user.entity";


export const GetUser = createParamDecorator((data: any, req: ExecutionContext) : User => {

    return req.switchToHttp().getRequest().user;
});
