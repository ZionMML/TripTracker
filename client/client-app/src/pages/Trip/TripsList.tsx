import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import { useDeleteTripMutation, useGetTripsQuery } from "../../services/api";
import {
  Button,
  Input,
  message,
  Space,
  type InputRef,
  type TableColumnsType,
} from "antd";
import type { Trip } from "../../types/types";
import DynamicTable from "../../components/DynamicTable";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { ColumnType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";
import { useRef } from "react";

const TripsList: React.FC = () => {
  const userInfo = useSelector((state: RootState) => state.auth);
  const username = userInfo?.user?.username;
  const { data: trips = [], isLoading } = useGetTripsQuery(username!, {
    skip: !username,
  });
  const [deleteTrip] = useDeleteTripMutation();
  const inputRef = useRef<InputRef>(null);
  const navigate = useNavigate();

  const tripsWithKeys: Trip[] = trips
    .filter((trip): trip is Trip => !!trip)
    .map((trip: Trip) => ({
      ...trip,
      key: trip.id,
      startDate: dayjs(trip.startDate).format("DD MMM YY hh:mm A"),
      endDate: dayjs(trip.endDate).format("DD MMM YY hh:mm A"),
      createdDate: dayjs(trip.createdDate).format("DD MMM YY hh:mm A"),
      updatedDate:
        trip.updatedDate &&
        dayjs(trip.updatedDate).isValid() &&
        dayjs(trip.updatedDate).year() > 1900
          ? dayjs(trip.updatedDate).format("DD MMM YY hh:mm A")
          : "-",
    }));

  const handleEdit = (record: Trip) => {
    navigate(`/trips/edit/${record.id}`);
  };

  const handleDelete = async (record: Trip) => {
    try {
      await deleteTrip({ id: record.id, username: username! }).unwrap();
      message.success("Deleted selected trip");
    } catch {
      message.error("Failed to delete selected trip");
    }
  };

  const getColumnSearchProps = (dataIndex: keyof Trip): ColumnType<Trip> => {
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

  const columns: TableColumnsType<Trip> = [
    {
      title: "Name",
      dataIndex: "knownAs",
      ellipsis: true,
      key: "knownAs",
      width: 120,
      ...getColumnSearchProps("knownAs"),
    },
    {
      title: "Start",
      dataIndex: "start",
      key: "start",
      ...getColumnSearchProps("start"),
    },
    {
      title: "End",
      dataIndex: "end",
      key: "end",
      ...getColumnSearchProps("end"),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a: Trip, b: Trip) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      sorter: (a: Trip, b: Trip) =>
        new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      sorter: (a: Trip, b: Trip) =>
        new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
    },
    {
      title: "Updated Date",
      dataIndex: "updatedDate",
      key: "updatedDate",
      ellipsis: true,
      width: 160,
      sorter: (a: Trip, b: Trip) =>
        new Date(a.updatedDate).getTime() - new Date(b.updatedDate).getTime(),
    },
  ];

  return (
    <div>
      <DynamicTable<Trip>
        data={tripsWithKeys}
        columns={columns}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        hideDeleteButton={userInfo.user?.role === "User" ? false : true}
      />
    </div>
  );
};

export default TripsList;
