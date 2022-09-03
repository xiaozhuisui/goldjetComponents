/*
 * @Date: 2022-09-03 17:05:29
 * @LastEditors: 追随
 * @LastEditTime: 2022-09-03 17:07:16
 */
import { request } from 'sula';
import EllipsisTooltip from '@/_components/EllipsisTooltip';

function requestStations(url: any, params: any, resKeyValues: any, value: any) {
  return request({
    url,
    method: 'GET',
    params,
    converter: ({ data }: { data: any }) => {
      const result = data || [];
      return (
        (result &&
          result.length &&
          result.map((ites: any) => {
            return {
              ...ites,
              text: (
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  {resKeyValues &&
                    resKeyValues.length &&
                    resKeyValues.map((i: any) => (
                      <EllipsisTooltip
                        key={i}
                        style={{
                          textAlign: 'left',
                          width: 100,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          display: 'inline',
                        }}
                        maxLength={10}
                        title={ites[i]}
                        showInfo={ites[i]}
                      />
                    ))}
                </div>
              ),
              value: ites[`${value}`],
            };
          })) ||
        []
      );
    },
  });
}

export { requestStations };
