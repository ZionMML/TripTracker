import {
  Upload,
  Button,
  message,
  Modal,
  Popconfirm,
  Tooltip,
  Carousel,
} from "antd";
import { UploadOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { RcFile } from "antd/es/upload";
import { useState } from "react";
import type { TripPhoto } from "../../types/types";
import {
  useAddTripPhotoMutation,
  useDeleteTripPhotoMutation,
} from "../../services/api";

type TripPhotoGalleryProps = {
  tripId: number;
  tripPhotos: TripPhoto[];
  onEnsureTripCreated?: () => Promise<number | null>;
  onPhotoUploadSuccess?: (newPhoto: TripPhoto) => void;
  onPhotoDeleteSuccess?: (photoId: number) => void;
};

const TripPhotoGallery: React.FC<TripPhotoGalleryProps> = ({
  tripId,
  tripPhotos,
  onEnsureTripCreated,
  onPhotoUploadSuccess,
  onPhotoDeleteSuccess,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [addTripPhoto] = useAddTripPhotoMutation();

  const [deleteTripPhoto] = useDeleteTripPhotoMutation();

  const handlePreview = (photo: TripPhoto) => {
    const index = tripPhotos.findIndex((p) => p.id === photo.id);
    setPreviewIndex(index);
    setPreviewVisible(true);
  };

  const handleDelete = async (photo: TripPhoto) => {
    try {
      await deleteTripPhoto({ tripId, photoId: photo.id }).unwrap();

      if (typeof onPhotoDeleteSuccess === "function")
        onPhotoDeleteSuccess(photo.id);

      message.success("Photo deleted");
    } catch {
      message.error("Failed to delete photo");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = async ({ file, onSuccess, onError }: any) => {
    if (tripId === 0 && onEnsureTripCreated) {
      const newId = await onEnsureTripCreated();
      if (!newId) {
        onError?.(new Error("Trip not created"));
        return;
      }
      tripId = newId;
    }
    const actualFile = file as RcFile;
    setIsUploading(true);

    try {
      const result = await addTripPhoto({ tripId, file: actualFile }).unwrap();

      if (typeof onPhotoUploadSuccess === "function")
        onPhotoUploadSuccess(result);

      message.success("Photo uploaded");
      onSuccess({}, new XMLHttpRequest());
    } catch (err) {
      onError?.(err);
      message.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Upload
        name="file"
        showUploadList={false}
        customRequest={handleUpload}
        accept="image/*"
      >
        <Button
          icon={<UploadOutlined />}
          type="primary"
          loading={isUploading}
          style={{ marginBottom: 16 }}
        >
          Upload Photo
        </Button>
      </Upload>

      <Carousel
        arrows
        slidesToShow={tripPhotos.length > 2 ? 3 : tripPhotos.length}
        style={{ marginBottom: 16 }}
      >
        {tripPhotos.map((photo) => (
          <div key={photo.id} style={{ padding: "0 8px" }}>
            <div
              style={{
                width: "100%",
                height: 160,
                position: "relative",
                border: "1px solid #f0f0f0",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <img
                src={photo.url}
                alt="Trip"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => handlePreview(photo)}
              />
              <div
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  display: "flex",
                  gap: 4,
                }}
              >
                <Tooltip title="Preview">
                  <EyeOutlined
                    style={{ color: "white", cursor: "pointer" }}
                    onClick={() => handlePreview(photo)}
                  />
                </Tooltip>
                <Tooltip title="Delete">
                  <Popconfirm
                    title="Delete this photo?"
                    onConfirm={() => handleDelete(photo)}
                  >
                    <DeleteOutlined
                      style={{ color: "white", cursor: "pointer" }}
                    />
                  </Popconfirm>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        {tripPhotos[previewIndex] && (
          <img
            alt="Preview"
            style={{
              maxHeight: "70vh",
              maxWidth: "100%",
              objectFit: "contain",
              margin: "0 auto",
              display: "block",
            }}
            src={tripPhotos[previewIndex].url}
          />
        )}
      </Modal>
    </>
  );
};

export default TripPhotoGallery;
