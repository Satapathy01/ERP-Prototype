type Props = {
  result: {
    totalRows: number;
    importedRows: number;
    failedRows: number;
    errors: {
      row: number;
      errors: string[];
    }[];
  };
};

export function ImportSummary({ result }: Props) {
  return (
    <div className="space-y-4 rounded-lg border p-4">

      <h3 className="font-semibold">
        Import Summary
      </h3>

      <div className="grid grid-cols-3 gap-4">

        <div>
          <p className="text-sm text-muted-foreground">
            Total
          </p>

          <p className="text-xl font-bold">
            {result.totalRows}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Imported
          </p>

          <p className="text-xl font-bold text-green-600">
            {result.importedRows}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">
            Failed
          </p>

          <p className="text-xl font-bold text-red-600">
            {result.failedRows}
          </p>
        </div>

      </div>

      {result.errors.length > 0 && (
        <div className="space-y-2">

          <h4 className="font-medium">
            Errors
          </h4>

          {result.errors.map((error) => (
            <div
              key={error.row}
              className="rounded-md border border-red-200 bg-red-50 p-3"
            >
              <p className="font-medium">
                Row {error.row}
              </p>

              {error.errors.map((message, index) => (
                <p
                  key={index}
                  className="text-sm text-red-600"
                >
                  {message}
                </p>
              ))}
            </div>
          ))}

        </div>
      )}

    </div>
  );
}