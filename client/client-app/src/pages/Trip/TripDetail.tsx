import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
} from "antd";
import type { CreateTripDto } from "../../types/types";
import {
  useCreateTripMutation,
  useGetTripQuery,
  useGetTripsQuery,
  useUpdateTripMutation,
} from "../../services/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleOutlined } from "@ant-design/icons";

type TripDetailProps = {
  isEditMode?: boolean;
};

const TripDetail: React.FC<TripDetailProps> = ({ isEditMode = false }) => {
  const [form] = Form.useForm<CreateTripDto>();
  const [createTrip, { isLoading }] = useCreateTripMutation();
  const [updateTrip] = useUpdateTripMutation();
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const showDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const MapKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const userInfo = useSelector((state: RootState) => state.auth);

  const params = useParams();
  const tripId = isEditMode ? parseInt(params.id!, 10) : 0;

  const username = userInfo?.user?.username;
  const { data: trips = [] } = useGetTripsQuery(username!, {
    skip: !username || isEditMode,
  });

  const { data: trip } = useGetTripQuery(tripId, {
    skip: !isEditMode || tripId === 0,
  });

  const formDisabled = userInfo.user?.role == "Admin" ? true : false;

  useEffect(() => {
    if (isEditMode && trip) {
      form.setFieldsValue({
        ...trip,
        startDate: trip.startDate
          ? (dayjs(trip.startDate) as unknown as string)
          : undefined,
        endDate: trip.endDate
          ? (dayjs(trip.endDate) as unknown as string)
          : undefined,
      });
    }
  }, [trip, form, isEditMode]);

  const handleSubmit = async (values: CreateTripDto) => {
    if (!isEditMode) {
      const hasIncompleteTrip = trips.some(
        (trip) => trip.status === "Started" || trip.status === "Delayed"
      );

      if (hasIncompleteTrip) {
        message.error("You have incomplete trips such as started or delayed.");
        return;
      }
    }

    try {
      const formattedValues = {
        ...values,
        username: userInfo.user?.username ?? "",
        userId: userInfo.user?.userId ?? "",
        startDate: dayjs(values.startDate).toISOString(),
        endDate: dayjs(values.endDate).toISOString(),
      };

      if (isEditMode) {
        await updateTrip({
          id: tripId,
          body: formattedValues,
        }).unwrap();
        message.success("Trip updated successfully");
      } else {
        await createTrip(formattedValues).unwrap();
        message.success("Trip created successfully");
      }
      setTimeout(() => {
        form.resetFields();
        navigate("/trip/tripslist");
      }, 500);
    } catch (error: unknown) {
      message.error("Failed to create trip");
      console.error(error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      disabled={formDisabled}
      style={{ maxWidth: "1000px", margin: "0 auto" }}
      onFinish={handleSubmit}
    >
      <Row gutter={32}>
        <Col span={12}>
          <Form.Item label="Trip Info" name="tripInfo">
            <Input.TextArea allowClear rows={3} />
          </Form.Item>

          <Form.Item
            label="Start Place"
            name="start"
            rules={[{ required: true, message: "Start Place is required" }]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item
            label="Start Date"
            name="startDate"
            rules={[{ required: true, message: "Start Date is required" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>

          <Form.Item
            label="End Place"
            name="end"
            rules={[{ required: true, message: "End Place is required" }]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item
            label="End Date"
            name="endDate"
            rules={[{ required: true, message: "End Date is required" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>

          <Form.Item
            label="Trip Status"
            name="status"
            rules={[{ required: true, message: "Trip Status is required" }]}
            initialValue="Planned"
          >
            <Select>
              <Select.Option value="Planned">Planned</Select.Option>
              <Select.Option value="Started">Started</Select.Option>
              {isEditMode && (
                <>
                  <Select.Option value="Delayed">Delayed</Select.Option>
                  <Select.Option value="Canceled">Canceled</Select.Option>
                  <Select.Option value="Completed">Completed</Select.Option>
                </>
              )}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button icon={<GoogleOutlined />} type="link" onClick={showDrawer}>
              Google Map
            </Button>
          </Form.Item>

          <Drawer
            title="Google Map"
            placement="right"
            onClose={closeDrawer}
            open={isDrawerOpen}
            width={600}
          >
            <iframe
              title="Google Map"
              width="100%"
              height="400"
              frameBorder="0"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${MapKey}&q=${form.getFieldValue(
                "end"
              )}`}
              allowFullScreen
            />
          </Drawer>

          <Form.Item style={{ marginTop: "25px" }}>
            <Button
              htmlType="button"
              disabled={formDisabled}
              style={{
                marginRight: "10px",
                backgroundColor: formDisabled ? "#f5f3f3ff" : "red",
                color: formDisabled ? "#b5b2b2ff" : "white",
                borderColor: formDisabled ? "#dbd4d4ff" : "red",
                cursor: formDisabled ? "not-allowed" : "pointer",
              }}
              onClick={() => form.resetFields()}
            >
              Reset
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default TripDetail;
