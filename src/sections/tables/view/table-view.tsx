import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { MRT_ColumnDef } from 'material-react-table';
import VaxTable, { type ActionMenuItem } from '../../../utils/VaxTablePage'; 

interface Testing {
  id: number;
  title: string;
}

const columns: MRT_ColumnDef<Testing>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'title', header: 'Testing' },
];
const data: Testing[] = [
  { id: 1, title: 'Task 1' },
  { id: 2, title: 'Task 2' },
];
const actionMenuItems: ActionMenuItem<Testing>[] = [
  { display: 'Edit', icon: <EditIcon />, handleClick: () => alert("hello there") },
  { display: 'Delete', icon: <DeleteIcon />, handleClick: (row) => console.log(row)},
];

export const TableView = () => (
    <VaxTable<Testing>
      columns={columns}
      data={data}
      tableHeader="Testing"
      customRightButton
      customRightButtonText="Add Task"
      customRightButtonIcon={<AddIcon />}
      customRightButtonCallBackFunction={() => alert('I just clicked the buttonss')}
      actionMenuItems={actionMenuItems}
      buttonStyles={{ backgroundColor: 'black' }}
      customRightButtonStyles={{ backgroundColor: 'black', borderRadius: 4, padding: '5px'}}
      headerStyles={{
        backgroundColor: '#1976D2', 
        color: 'white',
        fontSize: '16px', 
      }}
    />
  );

