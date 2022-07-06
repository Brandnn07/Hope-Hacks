const express = require('express');
// const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const session = require('express-session');
const routes = require('./controllers');
require('dotenv').config();

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const PORT = process.env.PORT || 3001;
const app = express();
const hbs = exphbs.create({});

const sess = {
  secret: process.env.SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.engine('handlebars', hbs.engine());
app.set('view engine', 'handlebars');

app.use(session(sess));
app.use(routes);
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  app.locals.layout = false;
});

app.post('/send', (req, res) => {
  const output = `
  <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
      </ul>
      <h3>Message</h3>
      <p>${req.body.message}</p>
      `;


  let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: 'FeminaR2H@outlook.com',
      pass: 'HopeHacks123'
    },
    tls: {
      rejectUnauthorized: false
    }
  });


  let mailOptions = {
    from: '"New Contact Request" <FeminaR2H@outlook.com>',
    to: 'FeminaR2h@outlook.com',
    subject: 'New Message',
    text: 'Hello world?',
    html: output
  };


  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('contact', { msg: 'Email Successfully Sent!' });
  });
});

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on PORT: http://localhost:${PORT}`));
});
