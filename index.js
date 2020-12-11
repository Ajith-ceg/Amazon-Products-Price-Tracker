require('dotenv').config()
const mail=require('@sendgrid/mail')
mail.setApiKey(process.env.SENDGRID_API_KEY)
const nightmare= require('nightmare')();

const args = process.argv.slice(2);
const url =args[0];//url has the product adress
const minPrice = args[1];// min price set by the user
checkPrice();

async function checkPrice(){
const priceString =await nightmare.goto(url)
                                 .wait("#priceblock_dealprice")
                                 .evaluate(()=> document.getElementById("priceblock_dealprice").innerText)
                                 .end()
const priceNumber = parseFloat(priceString.replace('₹',''));

//comparing the  prices

if(priceNumber<minPrice)
 {
     sendEmail(
         'Hurry up! The price is Low',
         `The price on ${url} has dropped below ${minPrice}`
     )
 }
}

function sendEmail(subject,body){
    const email={
        to : '123@gmail.com',
        from: 'amazon_price-tracker@gmai.com',
        subject: subject,
        text: body,
        html: body
    }
    return mail.send(email);
}