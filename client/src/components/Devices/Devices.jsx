import { PrimeDatatable } from '../../common/tables';
import { customColumnStyles } from '../../common/tables/TableColumnStyles';
import devices from '../../data/devices.json';
const Devices = () => {
  const tableFields = [
    {
      name: 'Device Type',
      searchKey: 'device_type',
      header: 'Device Type',
      customColumnStyle: customColumnStyles.DEVICES,
    },
    {
      name: 'AC Powered',
      searchKey: 'ac_powered',
      header: 'AC Powered',
      className: 'text-center',
      customColumnStyle: customColumnStyles.BOOLEANTAG,
    },
    {
      name: 'USB Powered',
      searchKey: 'usb_powered',
      header: 'USB Powered',
      customColumnStyle: customColumnStyles.BOOLEANTAG,
    },
    {
      name: 'Wireless Powered',
      searchKey: 'wireless_powered',
      header: 'Wireless Powered',
      customColumnStyle: customColumnStyles.BOOLEANTAG,
    },
    {
      name: 'Max Charging Current',
      searchKey: 'max_charging_current',
      header: 'Max Charging Current',
    },
    {
      name: 'Max Charging Voltage',
      searchKey: 'max_charging_voltage',
      header: 'Max Charging Voltage',
    },
    { name: 'Battery Level', searchKey: 'level', header: 'Battery Level' },
    { name: 'Voltage', searchKey: 'voltage', header: 'Voltage' },
    { name: 'Temperature', searchKey: 'temperature', header: 'Temperature' },
    { name: 'Storage Size', searchKey: 'size', header: 'Storage Size' },
    { name: 'Used Storage', searchKey: 'used', header: 'Used Storage' },
    {
      name: 'Available Storage',
      searchKey: 'available',
      header: 'Available Storage',
    },
  ];
  return (
    <div>
      <PrimeDatatable tableFields={tableFields} results={devices} />
    </div>
  );
};

export default Devices;
