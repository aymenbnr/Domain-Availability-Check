const whois = require('whois');
const chalk = require('chalk');
const fs = require('fs');

let domains;
let listOfDomainsFile = 'domains.txt';
let availableDomainFile = 'available.txt';
let errorDomainFile = 'error-checking.txt';

fs.readFile(listOfDomainsFile, 'utf8', (err, data) => {
    if (err) {
        console.log(chalk.redBright(`Unable to find ${listOfDomainsFile}`));
        return;
    }
    domains = data.trim().split('\n');

    domains.forEach((domain) => {
        try {
            whois.lookup(domain, { timeout: 3000 }, function (err, data) {
                if (err) {
                    console.log(chalk.redBright('Error checking: ') + `${chalk.redBright(domain)}`);
                    filterOut(errorDomainFile, `${domain}\n`);
                    return;
                }
                if (data.indexOf('Domain Name:') !== -1) {
                    console.log(`${chalk.redBright(domain)} is already taken`);
                } else {
                    console.log(`${chalk.greenBright(domain)} is available to buy`);
                    filterOut(availableDomainFile, `${domain}\n`);
                }
            });
        } catch (e) {
            //console.log('error');
        }
    })
});

//
let filterOut = (filename, data) => {
    fs.appendFile(filename, data, function (err) {
        if (err) throw err;
    });
}