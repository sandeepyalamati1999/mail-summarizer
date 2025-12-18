import { PrimeDatatable } from '../../common/tables';
import { badgeColor } from '../../constants/constants';
import { htmlComponentTypes } from '../../constants/constants';
import { z } from 'zod';

export const Tickets = () => {
  const displayDetails = { title: 'Tickets', iconName: 'tickets' };

  const countries = [
    { name: 'India', code: 'IN' },
    { name: 'America', code: 'IN' },
    { name: 'China', code: 'IN' },
    { name: 'Japan', code: 'IN' },
    { name: 'Russia', code: 'IN' },
  ];

  /**@DropdownOptions */
  const priorityOptions = [
    {
      label: 'Low',
      value: 'low',
      color: 'primary',
      badgeColor: badgeColor.CYAN,
    },
    {
      label: 'Medium',
      value: 'medium',
      color: 'secondary',
      badgeColor: badgeColor.VIOLET,
    },
    {
      label: 'High',
      value: 'high',
      color: 'success',
      badgeColor: badgeColor.ORANGE,
    },
    {
      label: 'Urgent',
      value: 'urgent',
      color: 'danger',
      badgeColor: badgeColor.RED,
    },
  ];

  const statusOptions = [
    { label: 'New', value: 'new', badgeColor: badgeColor.GRAY },
    { label: 'Open', value: 'open', badgeColor: badgeColor.ROSE },
    { label: 'In Progress', value: 'in progress', badgeColor: badgeColor.BLUE },
    { label: 'Pending', value: 'pending', badgeColor: badgeColor.YELLOW },
    { label: 'Resolved', value: 'resolved', badgeColor: badgeColor.GREEN },
    { label: 'Closed', value: 'closed', badgeColor: badgeColor.ORANGE },
  ];

  const categoryOptions = [
    { label: 'Hardware', value: 'hardware', badgeColor: badgeColor.RED },
    { label: 'Software', value: 'software', badgeColor: badgeColor.CYAN },
    { label: 'Network', value: 'network', badgeColor: badgeColor.ORANGE },
    { label: 'Billing', value: 'billing', badgeColor: badgeColor.PINK },
    {
      label: 'General Inquiry',
      value: 'general inquiry',
      badgeColor: badgeColor.GRAY,
    },
  ];

  /**@EndofDropdownOptions */

  /**@TableFields */
  const tableFields = [
    {
      name: 'name',
      searchKey: 'name',
      header: 'Name',
      type: htmlComponentTypes.INPUT,
      tableColumnStyle: 'Link',
      url: 'tickets',
    },
    {
      name: 'ticketId',
      searchKey: 'ticketId',
      header: 'Ticket ID',
      type: htmlComponentTypes.INPUT,
    },
    {
      name: 'subject',
      searchKey: 'subject',
      header: 'Subject',
      type: htmlComponentTypes.INPUT,
    },
    {
      name: 'description',
      searchKey: 'description',
      header: 'Description',
      type: htmlComponentTypes.INPUT,
    },
    {
      name: 'priority',
      searchKey: 'priority',
      header: 'Priority',
      type: htmlComponentTypes.DROPDOWN,
      tableColumnStyle: 'Badge',
      options: priorityOptions,
    },
    {
      name: 'status',
      searchKey: 'status',
      header: 'Status',
      type: htmlComponentTypes.DROPDOWN,
      tableColumnStyle: 'Badge',
      options: statusOptions,
    },
    {
      name: 'category',
      searchKey: 'category',
      header: 'Category',
      type: htmlComponentTypes.DROPDOWN,
      tableColumnStyle: 'Badge',
      options: categoryOptions,
    },
    {
      name: 'dateOfIssue',
      searchKey: 'dateOfIssue',
      header: 'Date Of Issue',
      type: htmlComponentTypes.CALENDAR,
      tableColumnStyle: 'Date',
    },
    {
      name: 'dateOfSubmission',
      searchKey: 'dateOfSubmission',
      header: 'Date Of Submission',
      type: htmlComponentTypes.CALENDAR,
      tableColumnStyle: 'Date',
    },
    {
      name: 'resolutionDate',
      searchKey: 'resolutionDate',
      header: 'Resolution Date',
      type: htmlComponentTypes.CALENDAR,
      tableColumnStyle: 'Date',
    },
    {
      name: 'Created',
      searchKey: 'created',
      header: 'Created',
      type: htmlComponentTypes.CALENDAR,
      tableColumnStyletype: 'Date',
    },
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
      name: 'name',
      label: 'Ticket Name',
      placeholder: 'Enter Ticket Name',
      type: htmlComponentTypes.INPUT,
      className: 'py-3',
    },
    {
      name: 'subject',
      label: 'Subject',
      placeholder: 'Enter Subject',
      type: htmlComponentTypes.INPUT,
    },
    {
      name: 'description',
      label: 'Description',
      placeholder: 'Enter Description',
      type: htmlComponentTypes.INPUT,
    },
    {
      name: 'category',
      label: 'Category',
      placeholder: 'Choose Category',
      options: categoryOptions,
      optionLabel: 'label',
      type: htmlComponentTypes.DROPDOWN,
    },
    {
      name: 'priority',
      label: 'Priority',
      placeholder: 'Choose Priority',
      options: priorityOptions,
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
    {
      name: 'dateOfIssue',
      label: 'Date of Issue',
      placeholder: 'Enter Date of issue',
      type: htmlComponentTypes.CALENDAR,
      className: 'py-3',
    },
    {
      name: 'dateOfSubmission',
      label: 'Date of Submission',
      placeholder: 'Enter Date of Submission',
      type: htmlComponentTypes.CALENDAR,
      className: 'py-3',
    },
    {
      name: 'resolutionDate',
      label: 'Resolution Date',
      placeholder: 'Enter Resolution Date',
      type: htmlComponentTypes.CALENDAR,
      className: 'py-3',
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
        url={'tickets'}
        responseKey={'tickets'}
        displayDetails={displayDetails}
        formFields={formFields}
        formSchema={formSchema}
      />
    </div>
  );
};
