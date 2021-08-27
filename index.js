const express = require('express');
const http = require('http');
const nodemailer = require('nodemailer');
const cors = require('cors');
var data = require('./data.js');
const ical = require('ical-generator');
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

function getIcalObjectInstance(starttime, endtime, summary,description, location, url , name ,email) {
    const cal = ical({ domain: "mytestwebsite.com", name: 'My test calendar event' });
    cal.domain("mytestwebsite.com");
    cal.createEvent({
            start: starttime,         // eg : moment()
            end: endtime,             // eg : moment(1,'days')
            summary: summary,         // 'Summary of your event'
            description: description, // 'More description'
            location: location,       // 'Delhi'
            url: url,                 // 'event url'
            organizer: {              // 'organizer details'
                name: name,
                email: email
            },
        });
    return cal;
    }

app.post("/v1/sendemail", (req, res) => {

    var transporter = nodemailer.createTransport({
        host: data.smtpserver,
        port: data.smtpport,
        secure: false, // upgrade later with STARTTLS
        tls: { rejectUnauthorized: false },
        debug: true,
        auth: {
            user: data.user,
            pass: data.pass
        }
    });


    let content = 'BEGIN:VCALENDAR\n' +
        'VERSION:2.0\n' +
        'BEGIN:VEVENT\n' +
        'SUMMARY:Summary123\n' +
        'DTSTART;VALUE=DATE:20201030T093000Z\n' +
        'DTEND;VALUE=DATE:20201030T113000Z\n' +
        'LOCATION:Webex \n' +
        'DESCRIPTION:Description123\n' +
        'STATUS:CONFIRMED\n' +
        'SEQUENCE:3\n' +
        'BEGIN:VALARM\n' +
        'TRIGGER:-PT10M\n' +
        'DESCRIPTION:Description123\n' +
        'ACTION:DISPLAY\n' +
        'END:VALARM\n' +
        'END:VEVENT\n' +
        'END:VCALENDAR';

    let mailOptions = {
        from: 'ecollect@co-opbank.co.ke',
        to: req.toemail,
        subject: "Call Schedule " + req.custname,
        html: "<body> Call schedule </body>",
        icalEvent: {
            filename: "invitation.ics",
            method: 'request',
            content: content
        }
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
            res.status(500).send({
                message: {
                    result: "Fail",
                    Error: "Could not sent email"
                }
            })
        }
        res.status(200).send({
            message: {
                result: "Success",
                Error: "Invite eamil sent"
            }
        })

    });
});

const port = process.env.PORT || '9000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`API running on localhost:${port}`);
});

