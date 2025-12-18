import { PrimeDatatable } from '../../common/tables';
import { badgeColor } from '../../constants/constants';
import { htmlComponentTypes } from '../../constants/constants';
import { z } from 'zod';

export const Roles = () => {
  const displayDetails = { title: 'Roles', iconName: 'chart-column-stacked' };

  const countries = [
    { name: 'India', code: 'IN' },
    { name: 'America', code: 'IN' },
    { name: 'China', code: 'IN' },
    { name: 'Japan', code: 'IN' },
    { name: 'Russia', code: 'IN' },
  ];

  /**@DropdownOptions */

  const statusOptions = [
    { label: 'Active', value: 'active', badgeColor: badgeColor.BLUE },
    { label: 'Pending', value: 'pending', badgeColor: badgeColor.ORANGE },
    { label: 'In Active', value: 'In Active', badgeColor: badgeColor.ROSE },
  ];

  const roleTypeOptions = [
    { label: 'Admin', value: 'admin', badgeColor: badgeColor.INDIGO },
    { label: 'Manager', value: 'manager', badgeColor: badgeColor.PINK },
    { label: 'Employee', value: 'Employee', badgeColor: badgeColor.ORANGE },
  ];

  /**@EndofDropdownOptions */

  /**@TableFields */
  const tableFields = [
    { name: 'role', searchKey: 'role', header: 'Role' },
    { name: 'roleType', searchKey: 'roleType', header: 'Role Type' },
    {
      name: 'status',
      searchKey: 'status',
      header: 'Status',
      tableColumnStyle: 'Badge',
      options: statusOptions,
    },
    { name: 'Created', searchKey: 'created', header: 'Created', type: 'Date' },
    { name: 'Created By', searchKey: 'createdBy', header: 'Created By' },
    {
      name: 'Actions',
      searchKey: 'actions',
      header: 'Actions',
      tableColumnStyle: 'Actions',
    },
  ];

  /**@FormFields */
  const formFields = [
    {
      name: 'role',
      label: 'Role',
      placeholder: 'Enter Role',
      type: htmlComponentTypes.INPUT,
      className: 'py-3',
    },
    {
      name: 'roleType',
      label: 'Role Type',
      placeholder: 'Choose Role Type',
      options: roleTypeOptions,
      optionLabel: 'label',
      type: htmlComponentTypes.DROPDOWN,
    },
    {
      name: 'status',
      label: 'Status',
      placeholder: 'Choose Status',
      options: statusOptions,
      optionLabel: 'label',
      type: htmlComponentTypes.DROPDOWN,
    },
  ];

  /**@ZodSchema */
  const formSchema = z.object({
    name: z.string().min(1, 'Ticket Name is required'),
    subject: z.string().min(1, 'Subject is required'),
    description: z.string().min(1, 'Description is required'),
  });
  return (
    <div>
      <PrimeDatatable
        tableFields={tableFields}
        url={'roles'}
        responseKey={'roles'}
        displayDetails={displayDetails}
        formFields={formFields}
        formSchema={formSchema}
      />
    </div>
  );
};
