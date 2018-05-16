export const getTodaysDate = () => {
  const d = new Date();

  const YYYY = d.getFullYear();
  let MM = d.getMonth() + 1;
  let DD = d.getDate();

  if (MM < 10) MM = '0' + MM;
  if (DD < 10) DD = '0' + DD;

  return YYYY + "-" + MM + "-" + DD;
}

export const millisecToTime = duration => {
  //let milliseconds = parseInt((duration % 1000) / 100);
  let seconds = parseInt((duration / 1000) % 60, 10);
  let minutes = parseInt((duration / (1000 * 60)) % 60, 10);
  let hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + "h " + minutes + "m " + seconds + "s";
}

export const millisecToTimeWithDays = duration => {
  //let milliseconds = parseInt((duration % 1000) / 100);
  let seconds = parseInt((duration / 1000) % 60, 10);
  let minutes = parseInt((duration / (1000 * 60)) % 60, 10);
  let hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10);
  let days = parseInt((duration / (1000 * 60 * 60 * 24)), 10);

  days = (days < 10) ? "0" + days : days;
  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return days + "d " + hours + "h " + minutes + "m " + seconds + "s";
}