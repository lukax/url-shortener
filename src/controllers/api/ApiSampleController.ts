import {JsonController, Get, Post, Param, Body} from "routing-controllers";
import {Inject, Service} from "typedi";
import {Url} from "../../model/Url";
import * as crypto from 'crypto';
import { UrlService } from "../../services/UrlService";

@Service()
@JsonController('/api')
export class ApiSampleController {

    @Inject()
    private urls: UrlService;

    /**
     * Sample API type insert
     * @param {string} name
     * @returns {Promise<any>}
     */
    @Post('/urls')
    async insertNewUrl(@Body() urlModel: any): Promise<any> {
        if(!urlModel.url || !urlModel.title){
            return 'Inform url and title';
        }

        const newUrl = new Url();
        newUrl.hash = crypto.createHash('sha1').update(urlModel.url).digest('hex').substring(0, 4);
        newUrl.url = urlModel.url;
        newUrl.title = urlModel.title;
        this.urls.persist(newUrl);
        return 'ok';
    }

    /**
     * Simple Hello World from the API
     * @returns {Promise<any>}
     */
    @Get('/urls')
    async getAllUrls(): Promise<any> {
        return this.urls.getAll();
    }

    
}