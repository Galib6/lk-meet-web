import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import duration from 'dayjs/plugin/duration';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(duration);
dayjs.extend(quarterOfYear);

export default dayjs;
