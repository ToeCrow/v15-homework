import fs from 'fs';

let pingCount = 0;

// 1
export const pingCounter = (req, res, next) => {
  pingCount ++;
  console.log(`Ping har anropats ${pingCount} gånger.`);
  next();
}

// 2
export const poweredBy = (req, res, next) => {
  res.setHeader('X-Powered-By', 'Chas');
  next();
};

// 3
export const logIpAdress = (req, res, next) => {
  const ip = req.ip;
  const logMessage = `IP adress: ${ip} - Time: ${new Date().toISOString()}\n`;

  console.log(logMessage);

  fs.appendFile('ip_log.txt', logMessage, (err) => {
    if (err) {
      console.error('Error saving log:', err)
    }
  });

  next();
}

// 4
export const requireName = (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).json({message: 'Name is required in the request body'});
  }
  next();
}