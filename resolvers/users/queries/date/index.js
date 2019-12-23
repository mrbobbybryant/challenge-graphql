import { format } from 'date-fns';

export default date => {
  if (!date) {
    return null;
  }

  const dateObj = 'string' === typeof date ? new Date(date) : date;
  return format(dateObj, 'MM/dd/y');
};
