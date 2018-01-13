import {Inject, Service} from "typedi";
import {Controller, Get, HttpCode, Redirect, Req, Res, UseBefore, ExpressMiddlewareInterface} from "routing-controllers";
import {ApiSampleController} from "../api/ApiSampleController";
import {LinkService} from "../../services/LinkService";
import {Request, Response} from "express";
import { authenticate } from "passport";
import { IAppConfig } from "../../app.config";


export class MyMiddleware implements ExpressMiddlewareInterface { // interface implementation is optional

    constructor (@Inject('config') private config: IAppConfig) {}

    use(request: any, response: any, next?: (err?: any) => any): any {
        console.log("do something...");
        return authenticate('auth0', <any>{
            clientID: this.config.auth.AUTH0_CLIENT_ID,
            domain: this.config.auth.AUTH0_DOMAIN,
            redirectUri: this.config.auth.AUTH0_CALLBACK_URL,
            responseType: 'code',
            audience: 'https://' + this.config.auth.AUTH0_DOMAIN + '/userinfo',
            scope: 'openid profile'
        })(request, response, next);
    }

}

@Service()
@Controller()
export class AuthController {

    @Inject()
    private links: LinkService;

    @Inject()
    private api: ApiSampleController;

    constructor (@Inject('config') private config: IAppConfig) {}

    /**
     * Login action.
     * @returns {any}
     */
    @Get('/login')
    @UseBefore(MyMiddleware)
    @HttpCode(200)
    async login(@Req() req: Request, @Res() res: Response): Promise<any> {
    }

    /**
     * Logout action.
     * @returns {any}
     */
    @Get('/logout')
    @HttpCode(200)
    @Redirect('/')
    async logout(@Req() request: Request): Promise<any> {
        request.logout();
    }


    /**
     * Callback action.
     * @returns {any}
     */
    @Get('/callback')
    @HttpCode(200)
    @Redirect('/')
    async callback(@Req() req: Request, @Res() res: Response): Promise<any> {
        return authenticate('auth0', {
            failureRedirect: '/failure'
        }).map(() =>  req.session.returnTo || '/');
    }

    /**
     * Callback action.
     * @returns {any}
     */
    @Get('/failure')
    @HttpCode(200)
    async failure(@Req() req: Request, @Res() res: Response): Promise<any> {
        const error = req.flash("error");
        const error_description = req.flash("error_description");
        req.logout();
        res.render('failure', {
            error: error[0],
            error_description: error_description[0],
        });
    }
}