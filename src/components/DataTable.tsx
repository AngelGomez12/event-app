import { Table, Flex, Text, Button, Box, TextField } from "@radix-ui/themes";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
  align?: "center" | "start" | "end";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  // Pagination
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  // Search
  onSearchChange?: (search: string) => void;
  searchPlaceholder?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  emptyMessage = "No se encontraron registros",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onSearchChange,
  searchPlaceholder = "Buscar...",
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState("");

  // Debounce search
  useEffect(() => {
    if (!onSearchChange) return;
    const timer = setTimeout(() => {
      onSearchChange(searchValue.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue, onSearchChange]);

  const clearSearch = () => {
    setSearchValue("");
    onSearchChange?.("");
  };

  const renderPageNumbers = () => {
    const pages: ReactNode[] = [
      <Button
        key={1}
        variant={currentPage === 1 ? "solid" : "ghost"}
        color="violet"
        size="1"
        onClick={() => onPageChange?.(1)}
        className="cursor-pointer min-w-8"
      >
        1
      </Button>,
    ];

    if (currentPage > 2) {
      pages.push(
        <Text key="ellipsis-start" color="gray" size="1">
          ...
        </Text>,
      );
    }

    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(
        <Button
          key={currentPage}
          variant="solid"
          color="violet"
          size="1"
          onClick={() => onPageChange?.(currentPage)}
          className="cursor-pointer min-w-8"
        >
          {currentPage}
        </Button>,
      );
    }

    if (currentPage < totalPages - 1) {
      pages.push(
        <Text key="ellipsis-end" color="gray" size="1">
          ...
        </Text>,
      );
    }

    if (totalPages > 1) {
      pages.push(
        <Button
          key={totalPages}
          variant={currentPage === totalPages ? "solid" : "ghost"}
          color="violet"
          size="1"
          onClick={() => onPageChange?.(totalPages)}
          className="cursor-pointer min-w-8"
        >
          {totalPages}
        </Button>,
      );
    }

    return pages;
  };

  return (
    <Box>
      {onSearchChange && (
        <Box p="4" className="border-b border-slate-100 bg-slate-50/30">
          <Flex gap="3" align="center" style={{ maxWidth: 400 }}>
            <TextField.Root
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              size="2"
              className="flex-1"
            >
              <TextField.Slot>
                <Search size={14} className="text-slate-400" />
              </TextField.Slot>
              {searchValue && (
                <TextField.Slot side="right">
                  <Button
                    variant="ghost"
                    color="gray"
                    size="1"
                    onClick={clearSearch}
                    className="cursor-pointer"
                  >
                    <X size={14} />
                  </Button>
                </TextField.Slot>
              )}
            </TextField.Root>
          </Flex>
        </Box>
      )}

      {isLoading ? (
        <Flex justify="center" py="9" align="center" direction="column" gap="4">
          <Box className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <Text className="text-slate-500 font-medium animate-pulse">
            Cargando datos...
          </Text>
        </Flex>
      ) : !data || data.length === 0 ? (
        <Flex justify="center" py="9" direction="column" align="center" gap="4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
            <Search size={32} />
          </div>
          <Box className="text-center">
            <Text size="3" weight="bold" className="block text-slate-900">
              Sin resultados
            </Text>
            <Text size="2" color="gray">
              {emptyMessage}
            </Text>
          </Box>
        </Flex>
      ) : (
        <>
          <div className="overflow-x-auto">
            <Table.Root variant="ghost">
              <Table.Header>
                <Table.Row className="bg-slate-50/50">
                  {columns.map((col, idx) => (
                    <Table.ColumnHeaderCell
                      key={idx}
                      className={col.className}
                      justify={col.align}
                    >
                      <Text size="2" weight="bold" color="gray">
                        {col.header}
                      </Text>
                    </Table.ColumnHeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {data.map((item) => (
                  <Table.Row
                    key={item.id}
                    align="center"
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {columns.map((col, idx) => (
                      <Table.Cell
                        key={idx}
                        justify={col.align}
                        className="py-4"
                      >
                        {typeof col.accessor === "function"
                          ? col.accessor(item)
                          : (item[col.accessor] as ReactNode)}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Flex
              justify="between"
              align="center"
              p="4"
              className="border-t border-slate-100 bg-slate-50/30"
            >
              <Text size="1" color="gray" weight="medium">
                Total{" "}
                <Text color="violet" weight="bold">
                  {totalPages}
                </Text>{" "}
                {totalPages === 1 ? "página" : "páginas"}
              </Text>

              <Flex gap="3" align="center">
                <Button
                  variant="soft"
                  color="gray"
                  size="1"
                  disabled={currentPage === 1}
                  onClick={() => onPageChange?.(currentPage - 1)}
                  className="cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </Button>

                <Flex gap="1" align="center">
                  {renderPageNumbers()}
                </Flex>

                <Button
                  variant="soft"
                  color="gray"
                  size="1"
                  disabled={currentPage === totalPages}
                  onClick={() => onPageChange?.(currentPage + 1)}
                  className="cursor-pointer"
                >
                  <ChevronRight size={14} />
                </Button>
              </Flex>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
}
