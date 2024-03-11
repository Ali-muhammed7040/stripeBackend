const cors = require('cors')
const express = require('express')

// Lee add stripe key here
const stripe = require('stripe')('sk_test_51NRCU1EHOlvr6BcsBWN9qJOtiTxT7ndik9L6iI3P4fBo7eOhMreftQBfu3K1ZCz0mWePSVJOHCduBzfKRIMlMHst00el5MFdrY')
const uuid = require('uuid')
const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.post('/payment', (req, res) => {
    const { product, token } = req.body
    console.log('product', product);
    console.log('price', product.price);
    const idempontencyKey = uuid()

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: `Charge for ${product.name}`,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        }, { idempontencyKey })
    }).then((result) => res.status(200).json(result)).catch((err) => console.log(err))
})


app.listen(8282, () => console.log('listening at port 8282'))