import { useState } from "react";
import { Button } from "../../ui/Button";
import { Icon } from "../../ui/Icon";
import { SupplierForm } from "../SupplierForm";
import type { CreateSupplierSectionProps } from "./interface";

export function CreateSupplierSection({
  onCreate,
  isCreating,
  onCreateClick,
  onSuccess,
  onCancel,
  showCancel = false,
}: CreateSupplierSectionProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  // If we're in side panel mode, show the form directly
  if (onCreateClick) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Create New Supplier</h2>
          {onCancel && (
            <Button variant="outline" handlePress={onCancel}>
              Cancel
            </Button>
          )}
        </div>

        <SupplierForm
          mode="create"
          onSuccess={onSuccess || (() => setShowCreateForm(false))}
          onError={(error: Error) => {
            alert(`Error creating supplier: ${error.message}`);
          }}
          onCancel={onCancel || (() => setShowCreateForm(false))}
          showCancel={showCancel}
          onCreate={onCreate}
          isLoading={isCreating}
        />
      </div>
    );
  }

  // Original inline mode
  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  const handleCreateError = (error: Error) => {
    alert(`Error creating supplier: ${error.message}`);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="solid"
          iconOnly
          handlePress={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? <Icon name="CloseBtn" /> : <Icon name="Plus" />}
        </Button>
      </div>

      {showCreateForm && (
        <SupplierForm
          mode="create"
          onSuccess={handleCreateSuccess}
          onError={handleCreateError}
          onCancel={() => setShowCreateForm(false)}
          showCancel={true}
          onCreate={onCreate}
          isLoading={isCreating}
        />
      )}
    </div>
  );
}
