import React from "react";
import { Table, Button, Popconfirm } from "antd";
import type { TableColumnsType } from "antd";
import { createStyles } from "antd-style";

const useStyle = createStyles(() => ({
  customTable: {
    //emotion-style object css
    [".ant-table-container .ant-table-body, .ant-table-container .ant-table-content"]:
      {
        scrollbarWidth: "thin",
        scrollbarColor: "#eaeaea transparent",
        scrollbarGutter: "stable",
      },
  },
}));

interface DynamicTableProps<T extends { key: React.Key }> {
  data: T[];
  columns: TableColumnsType<T>;
  loading?: boolean;
  onEdit?: (record: T) => void;
  onDelete?: (record: T) => void;
  showActions?: boolean;
}

const DynamicTable = <T extends { key: React.Key }>({
  data,
  columns,
  onEdit,
  onDelete,
  showActions = true,
}: DynamicTableProps<T>) => {
  const { styles } = useStyle();

  const actionColumn: TableColumnsType<T>[number] = {
    title: "Action",
    key: "action",
    fixed: "right",
    width: 120,
    render: (_, record) => {
      return (
        <>
          {onEdit && (
            <Button type="link" onClick={() => onEdit(record)}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={() => onDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          )}
        </>
      );
    },
  };

  const finalColumns = showActions ? [...columns, actionColumn] : columns;

  return (
    <Table<T>
      className={styles.customTable}
      columns={finalColumns}
      dataSource={data}
      scroll={{ x: "max-content", y: 54 * 10 }}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default DynamicTable;
