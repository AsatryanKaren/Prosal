import { jwtDecode } from "jwt-decode";

type T_Func = (key: string) => [
  () => ReturnType<Storage['getItem']>,
  (value: string) => ReturnType<Storage['setItem']>
]

export const handleLocalStorageByKey: T_Func = (key) => {
  return [
    () => window.localStorage.getItem(key),
    (value) => window.localStorage.setItem(key, value),
  ]
}

export const getClientIdFromToken = (token: string | null) => {
  // @ts-ignore
  const decodedToken = jwtDecode<{client_id: string}>(token);

  return decodedToken.client_id;
}

export function findMatchingIdType(data:any) {
  const { careerStepEntityId, applicantId, candidateId, employeeId } = data;

  const pairs = {
    [applicantId]: 'applicants',
    [candidateId]: 'candidates',
    [employeeId]: 'employeeId',
  }

  if (pairs[careerStepEntityId]) {
    return {
      type: pairs[careerStepEntityId],
      id: careerStepEntityId
    }
  }

  return {
    type: 'No match found',
    id: null
  }
}

const format = (date:string) => {
  const convertDate = Date.parse(date);
  if (!isNaN(convertDate)) {
    const newDate = new Date(convertDate)
    return `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-01`;
  }
  return '';
};

export function formatDate(dateRange:string, delimiter: string) {
  let result = { startDate: '', endDate: '' }
  if (!dateRange) return result;

  const [injectedStartDate, injectedEndDate] = dateRange.split(delimiter);

  if (injectedEndDate) {
    result.startDate = format(injectedStartDate);
    result.endDate = format(injectedEndDate?.includes(' · ') ? injectedEndDate.split(' · ')[0] : injectedEndDate);
  } else {
    result.startDate = format(injectedStartDate.split('to Present')[0])
  }

  return result
}

export function extractIdFromUrl(url:string) {
  let match = url?.match(/individualRfp\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export function isDateMoreThan15DaysAway(givenDate:any) {
  const today = new Date();

  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 15);

  const parsedDate = new Date(givenDate);

  return parsedDate > futureDate;
}
