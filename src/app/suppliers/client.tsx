"use client";

import { useState } from "react";
import { SupplierForm } from "@/components/SupplierForm";
import { useSuppliers } from "@/hooks/useSuppliersQuery";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { SupplierCard } from "@/components/SupplierCard";
import type { Supplier } from "@/utils/types/database";

interface SuppliersClientProps {
  userId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const SuppliersClient = ({ userId }: SuppliersClientProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const {
    suppliers,
    loading,
    error,
    refetch,
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isDeleting,
  } = useSuppliers();

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    // The useSuppliers hook will automatically update the list
  };

  const handleCreateError = (error: Error) => {
    alert(`Error creating supplier: ${error.message}`);
  };

  const handleEditSuccess = () => {
    setEditingSupplier(null);
    // The useSuppliers hook will automatically update the list
  };

  const handleEditError = (error: Error) => {
    console.error("Failed to update supplier:", error);
    alert(`Error updating supplier: ${error.message}`);
  };

  const handleEdit = (id: string) => {
    const supplier = suppliers.find((s) => s.id === id);
    if (supplier) {
      setEditingSupplier(supplier);
    }
  };

  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      {/* Create Form Section */}
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
            onCreate={create}
            isLoading={isCreating}
          />
        )}
      </div>

      {/* Edit Form Section */}
      {editingSupplier && (
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Edit Supplier</h2>
            <Button
              variant="outline"
              handlePress={() => setEditingSupplier(null)}
            >
              Cancel Edit
            </Button>
          </div>

          <SupplierForm
            mode="edit"
            initialData={editingSupplier}
            onSuccess={handleEditSuccess}
            onError={handleEditError}
            onCancel={() => setEditingSupplier(null)}
            showCancel={true}
            onUpdate={update}
            onDelete={remove}
            isLoading={isUpdating || isDeleting}
          />
        </div>
      )}

      {/* Suppliers List Section */}
      <div className="w-full">
        {loading && suppliers.length === 0 ? (
          <p className="text-gray-500">Loading suppliers...</p>
        ) : error ? (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded p-4">
            <p className="font-semibold">Error loading suppliers:</p>
            <p>{error}</p>
            <Button
              variant="outline"
              handlePress={() => refetch()}
              className="mt-2"
            >
              Retry
            </Button>
          </div>
        ) : suppliers.length === 0 ? (
          <p className="text-gray-500">
            No suppliers found. Create your first supplier above!
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            {suppliers.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                id={supplier.id}
                supplierName={supplier.name}
                description={supplier.description}
                contactName={supplier.contact.contactName}
                email={supplier.contact.email}
                phone={supplier.contact.phone}
                website={supplier.contact.website}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
