import {Request, Response} from 'express';
let Canvas = require('canvas');

const wrapWords = (context, text, x, y, lineHeight, fitWidth) => {
    fitWidth = fitWidth || 0;

    if (fitWidth <= 0)
    {
        context.fillText( text, x, y );
        return;
    }
    var words = text.split(' ');
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length)
    {
        var str = words.slice(0,idx).join(' ');
        var w = context.measureText(str).width;
        if ( w > fitWidth )
        {
            if (idx==1)
            {
                idx=2;
            }
            context.fillText( words.slice(0,idx-1).join(' '), x, y + (lineHeight*currentLine) );
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
        }
        else
        {idx++;}
    }
    if  (idx > 0)
        context.fillText( words.join(' '), x, y + (lineHeight*currentLine) );
};

export const generateImage = (req: Request, res: Response) => {
  let buyToken = decodeURIComponent(req.params.buyToken).toUpperCase();
  let buyTokenAmt = decodeURIComponent(req.params.buyTokenAmt);
  let sellToken = decodeURIComponent(req.params.sellToken).toUpperCase();
  let sellTokenAmt = decodeURIComponent(req.params.sellTokenAmt);
  let message = decodeURIComponent(req.params.message);
  let canvas = new Canvas(200, 150);
  let c = canvas.getContext('2d');

  c.font = '14px Courier';

  // let txt = 'this is a very long text. Some more to print!';
  let txt = "Hey there. I'd like to trade " + sellTokenAmt + ' ' + sellToken + ' for ' +
    buyTokenAmt + ' ' + buyToken + '. ' + message;

  wrapWords(c, txt, 10, 20, 18, 180 );

  let stream = canvas.createPNGStream();
  res.type("png");
  stream.pipe(res);
};
