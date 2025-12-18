import { useForm } from 'react-hook-form';
import { z } from 'zod';
import CommonDropdown from '../common/form/dropdowns/CommonDropdown';
import CommonSelect from '../common/form/select/CommonSelect';
import CommonRadio from '../common/form/radio/CommonRadio';
import CommonCheckbox from '../common/form/checkbox/CommonCheckbox';
import CommonButton from '../common/button/CommonButton';
import { PrimeInput } from '../common/form/Inputs';
import { useDispatch } from 'react-redux';
import { DialogTypes } from '../redux/reducers/Uislice';
import { hideDialog } from '../redux/reducers/dialogSlice';
import { dialogTypes, htmlComponentTypes } from '../constants/constants';
import CommonForm from '../common/form/CommonForm';
import CommonLucideIcon from '../common/Icons/CommonLucideIcon';
const Test = () => {
  const { handleSubmit, control } = useForm();
  const dispatch = useDispatch();
  const countries = [
    { name: 'India', code: 'IN' },
    { name: 'America', code: 'IN' },
    { name: 'China', code: 'IN' },
    { name: 'Japan', code: 'IN' },
    { name: 'Russia', code: 'IN' },
  ];

  const onSubmit = (values) => {
    console.log('VALUES FROM COMMON FORM---------------------->', values);
    dispatch(hideDialog({ type: dialogTypes.COMMONDIALOG }));
  };

  const formFields = [
    {
      name: 'deviceName',
      label: 'Device Name',
      placeholder: 'Enter Device Name',
      type: htmlComponentTypes.INPUT,
      className: 'py-3',
    },
    {
      name: 'deviceType',
      label: 'Device Type',
      placeholder: 'Enter Device Type',
      type: htmlComponentTypes.INPUT,
    },
    {
      name: 'ipAddress',
      label: 'IP Address',
      placeholder: 'Enter IP Address',
      type: htmlComponentTypes.INPUT,
    },
    {
      name: 'countries',
      label: 'Countries',
      options: countries,
      optionLabel: 'name',
      type: htmlComponentTypes.DROPDOWN,
    },
    {
      name: 'countryRadio',
      label: 'Country Radios',
      options: countries,
      optionLabel: 'name',
      type: htmlComponentTypes.RADIO,
    },
  ];

  const formSchema = z.object({
    deviceName: z.string().min(3, 'Device Name is required'),
    deviceType: z.string().min(3).max(20),
    ipAddress: z.string().ip(),
    countryRadio: z.string(),
  });
  return (
    <>
      <CommonForm
        schema={formSchema}
        formFields={formFields}
        onSubmit={onSubmit}
      >
        <div className="flex justify-end me-4 gap-6 pt-10">
          <CommonButton
            className="py-3 px-10 rounded-md"
            variant={'outlineCancel'}
            onClick={() =>
              dispatch(hideDialog({ type: dialogTypes.COMMONDIALOG }))
            }
          >
            <div className="flex gap-3 items-center">
              <div className="bg-cancel rounded-full p-[1px]">
                <CommonLucideIcon
                  name={'arrow-left'}
                  size={14}
                  className={'text-white'}
                />
              </div>
              Cancel
            </div>
          </CommonButton>
          <CommonButton className={'py-3 px-10 rounded-md'}>
            Submit
          </CommonButton>
        </div>
      </CommonForm>
    </>
    // <form onSubmit={handleSubmit(submitter)}>
    //   <div>
    //     <div className="grid xl:grid-cols-2 xl:gap-8">
    //       <PrimeInput
    //         name="deviceName"
    //         label="Device Name"
    //         placeholder={"Enter Device name"}
    //         control={control}
    //       />
    //       <PrimeInput
    //         name="deviceType"
    //         label="Device Type"
    //         placeholder={"Enter Device Type"}
    //         control={control}
    //       />
    //       <PrimeInput
    //         name="ipAddress"
    //         label="IP Address"
    //         placeholder={"Enter IP Address"}
    //         control={control}
    //       />

    //         {/* <CommonDropdown
    //         label="Select"
    //         name="select"
    //         control={control}
    //         options={countries}
    //         optionLabel="name"
    //         />
    //         <CommonDropdown
    //         label="Select"
    //         name="select"
    //         control={control}
    //         options={countries}
    //         optionLabel="name"
    //         />
    //         <CommonDropdown
    //         label="Select"
    //         name="select3"
    //         control={control}
    //         options={countries}
    //         optionLabel="name"
    //         />
    //         <CommonSelect
    //         label="Select"
    //         name="select4"
    //         control={control}
    //         options={countries}
    //         optionLabel="name"
    //         />
    //         <CommonRadio
    //         label="Radio"
    //         name="radio"
    //         control={control}
    //         options={countries}
    //         optionLabel="name"
    //         />
    //         <CommonCheckbox
    //         label="Checkbox"
    //         name="checkbox"
    //         control={control}
    //         options={countries}
    //         optionLabel="name"
    //         /> */}
    //     </div>
    //     <div className="flex items-center justify-end gap-5 p-5 my-4">
    //         <CommonButton.Cancel onClick={() => dispatch(hideDialog({ type: DialogTypes.COMMONDIALOG}))}>Cancel</CommonButton.Cancel>
    //         <CommonButton>Submit</CommonButton>
    //       </div>
    //   </div>
    // </form>
  );
};

export default Test;
