import {Inject, Service} from "typedi";
import {Controller, Get, Render, HttpCode, Req, Res, Param, UseBefore} from "routing-controllers";
import {ApiSampleController} from "../api/ApiSampleController";
import {Request, Response} from "express";
import { LinkService } from "../../services/LinkService";
import { Link } from "../../model/Link";
import * as pTimeout from "p-timeout";
import { URL } from "url";
import * as puppeteer from "puppeteer";
import blocked = require("../../../blocked.json");
import { IAppConfig } from "../../app.config";
import { ensureLoggedIn } from "connect-ensure-login";

@Service()
@Controller()
@UseBefore(ensureLoggedIn())
export class AdminController {

    @Inject()
    private links: LinkService;

    @Inject()
    private api: ApiSampleController;

    constructor (@Inject('config') private config: IAppConfig) {}

    /**
     * Index action.
     * @returns {any}
     */
    @Render('admin')
    @Get('/admin')
    @HttpCode(200)
    async indexAction(@Req() req: Request): Promise<any> {
        const links: Link[] = await this.links.getAllByUser(req.user.email);
        return {
            title: this.config.app.title,
            links: links,
            userEmail: req.user != null ? req.user.email : null
        };
    }

}