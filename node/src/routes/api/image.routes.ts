import {Express} from 'express';
import * as ImageController from '../../controllers/image.controller';

const ImageRoutes = (app: Express) => {

	app.get('/api/image/:sellToken/:sellTokenAmt/:buyToken/:buyTokenAmt/:message', ImageController.generateImage);
};

export default ImageRoutes;
