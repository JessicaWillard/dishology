import { useState } from "react";
import { Button } from "../../ui/Button";
import { Icon } from "../../ui/Icon";
import { SupplierForm } from "../SupplierForm";
import type { Supplier, SupplierFormData } from "@/utils/types/database";

interface CreateSupplierSectionProps {
  onCreate: (data: SupplierFormData) => Promise<Supplier>;
  isCreating: boolean;
}

export function CreateSupplierSection({
  onCreate,
  isCreating,
}: CreateSupplierSectionProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

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
