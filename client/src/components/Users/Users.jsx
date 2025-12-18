import { PrimeDatatable } from '../../common/tables';
import { badgeColor } from '../../constants/constants';
import { htmlComponentTypes } from '../../constants/constants';
import { z } from 'zod';

export const Users = () => {
  const displayDetails = { title: 'Users', iconName: 'user-round-cog' };

  /**@DropdownOptions */

  /**@EndofDropdownOptions */

  /**@TableFields */
  const tableFields = [
    { name: 'userName', searchKey: 'userName', header: 'User Name' },
    { name: 'email', searchKey: 'email', header: 'Email' },
    { name: 'phoneNo', searchKey: 'phoneNo', header: 'Phone Number' },
    { name: 'department', searchKey: 'department', header: 'Department' },
    { name: 'location', searchKey: 'location', header: 'Location' },
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
      name: 'userName',
      label: 'User Name',
      placeholder: 'Enter User Name',
      type: htmlComponentTypes.INPUT,
      className: 'py-3',
    },
    {
      name: 'name',
      label: 'Full Name',
      placeholder: 'Enter Full Name',
      type: htmlComponentTypes.INPUT,
      className: 'py-3',
    },
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Enter Email',
      type: htmlComponentTypes.INPUT,
    },
    {
      name: 'phoneNo',
      label: 'Phone No',
      placeholder: 'Enter Phone Number',
      type: htmlComponentTypes.INPUT,
    },
    {
      name: 'department',
      label: 'Department',
      placeholder: 'Enter Department',
      type: htmlComponentTypes.INPUT,
    },
    {
      name: 'location',
      label: 'Location',
      placeholder: 'Enter Location',
      type: htmlComponentTypes.INPUT,
    },
    {
      name: 'password',
      label: 'Password',
      placeholder: 'Enter Password',
      type: htmlComponentTypes.INPUT,
    },
    {
      name: 'role',
      label: 'Role',
      placeholder: 'Choose Role',
      type: htmlComponentTypes.DROPDOWN,
      options: 'fromAPI',
      optionLabel: 'role',
      url: 'roles',
    },
    {
      name: 'photo',
      label: 'Image',
      placeholder: 'Upload profile',
      type: htmlComponentTypes.UPLOAD,
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
        url={'employees'}
        responseKey={'employees'}
        displayDetails={displayDetails}
        formFields={formFields}
        formSchema={formSchema}
      />
    </div>
  );
};
