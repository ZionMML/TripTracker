import React, { useRef } from "react";
import { Button, Space, Input, Tag } from "antd";
import type { InputRef, TableColumnsType } from "antd";
import { useGetUsersQuery } from "../../services/api";
import DynamicTable from "../../components/DynamicTable";
import type { User } from "../../types/types";
import type { ColumnType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";

const UsersList: React.FC = () => {
  const { data: users = [], isLoading } = useGetUsersQuery();
  const inputRef = useRef<InputRef>(null);

  console.log("users:", JSON.stringify(users, null, 2));

  const usersWithKeys: User[] = users
    .filter((user): user is User => !!user)
    .map((user: User) => ({
      ...user,
      key: user.username,
    }));

  const handleEdit = (record: User) => {
    console.log("Edit:", record);
  };

  const handleDelete = (record: User) => {
    console.log("Delete:", record);
  };
  const getColumnSearchProps = (dataIndex: keyof User): ColumnType<User> => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: FilterDropdownProps) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={inputRef}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
            >
              Search
            </Button>
            <Button onClick={() => clearFilters?.()} size="small">
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        String(record[dataIndex])
          .toLowerCase()
          .includes(String(value).toLowerCase()),
    };
  };

  const columns: TableColumnsType<User> = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Known As",
      dataIndex: "knownAs",
      key: "knownAs",
      ...getColumnSearchProps("knownAs"),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      filters: [
        { text: "Male", value: "Male" },
        { text: "Female", value: "Female" },
        { text: "Others", value: "Others" },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "Date of Birth",
      dataIndex: "dateOfBirth",
      key: "dob",
      sorter: (a: User, b: User) =>
        new Date(a.dateOfBirth).getTime() - new Date(b.dateOfBirth).getTime(),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      sorter: (a, b) => a.city.localeCompare(b.city),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      sorter: (a, b) => a.country.localeCompare(b.country),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => <Tag color="blue">{role}</Tag>,
      filters: [
        { text: "Admin", value: "Admin" },
        { text: "User", value: "User" },
      ],
      onFilter: (value, record) => record.role === value,
    },
  ];

  return (
    <div>
      <DynamicTable<User>
        data={usersWithKeys}
        columns={columns}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UsersList;
