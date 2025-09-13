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
}: CreateSupplierSectionProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  // If we're in side panel mode, show the form directly
  if (onCreateClick) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Create New Supplier</h2>
        </div>

        <SupplierForm
          mode="create"
          onSuccess={onSuccess || (() => setShowCreateForm(false))}
          onError={(error: Error) => {
            alert(`Error creating supplier: ${error.message}`);
          }}
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
          onCreate={onCreate}
          isLoading={isCreating}
        />
      )}
    </div>
  );
}
