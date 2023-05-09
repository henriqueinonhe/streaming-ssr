import { isClient } from "../utils";
import { useRequestId } from "./useRequestId";

const store = {};

export const useData = (id) => {
  const requestId = useRequestId();

  const cacheKey = `${id}-${requestId}`;

  if (isClient) {
    const serializedData = window.__DATA__[cacheKey];

    if (serializedData) {
      const data = JSON.parse(serializedData);

      return {
        data,
        clientSideCache: <ClientSideCache cacheKey={cacheKey} data={data} />,
      };
    }
  }

  if (!store[cacheKey]) {
    store[cacheKey] = {
      promise: new Promise((resolve) =>
        fetchData(id).then((data) => {
          store[cacheKey].isFulfilled = true;
          store[cacheKey].data = data;
          resolve(data);
        })
      ),
      data: undefined,
      isFulfilled: false,
    };
  }

  const { promise, isFulfilled } = store[cacheKey];

  if (!isFulfilled) {
    throw promise;
  }

  const data = store[cacheKey].data;

  return {
    data,
    clientSideCache: <ClientSideCache cacheKey={cacheKey} data={data} />,
  };
};

const ClientSideCache = ({ cacheKey, data }) => (
  <script
    dangerouslySetInnerHTML={{
      __html: `
      if(!window.__DATA__) {
        window.__DATA__ = {};
      }

      window.__DATA__['${cacheKey}'] = ${JSON.stringify(data)};
    `,
    }}
  />
);

const fetchData = (id) =>
  fetch(`http://localhost:3000/data/${id}`).then((res) => {
    console.log(`Data ${id} fetched!`);
    return res.text();
  });
