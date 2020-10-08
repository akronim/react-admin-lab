import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  Create,
  SelectInput,
  Filter,
} from "react-admin";



export const PostList = (props) => (
  <List filters={<PostFilter />} {...props}>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="id" />
      <TextField source="title" />
      <EditButton />
    </Datagrid>
  </List>
);

// export const PostList = (props) => (
//     <List {...props}>
//         <SimpleList
//             primaryText={record => record.title}
//             secondaryText={record => `${record.views} views`}
//             tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
//         />
//     </List>
// );

// title={<PostTitle />}
export const PostEdit = (props) => (
  <Edit  {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <ReferenceInput source="userId" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="title" />
      <TextInput multiline source="body" />
    </SimpleForm>
  </Edit>
);

export const PostCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <ReferenceInput source="userId" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <TextInput source="title" />
      <TextInput multiline source="body" />
    </SimpleForm>
  </Create>
);

const PostFilter = (props) => (
    <Filter {...props}>
      <TextInput label="Search" source="q" alwaysOn />
      <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
        <SelectInput optionText="name" />
      </ReferenceInput>
    </Filter>
  );
