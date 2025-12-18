import { PrimeDatatable } from "../../common/tables";

export const Districts = () => {
  /**@TableFields */
  const tableFields = [
    { name: 'userName', searchKey: 'userName', header: 'User Name' },
    { name: 'email', searchKey: 'email', header: 'Email' },
    { name: 'Created', searchKey: 'created', header: 'Created', type: 'Date' },
    { name: 'Created By', searchKey: 'createdBy', header: 'Created By' },
  ];

  return (
    <div>
      <PrimeDatatable
        tableFields={tableFields}
        url={'users'}
        responseKey={'users'}
      />
    </div>
  );
};
