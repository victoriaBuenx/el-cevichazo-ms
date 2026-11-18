using System.Text.Json;
using System.Text.Json.Serialization;

namespace ElCevichazo.Domain.Enums;

[JsonConverter(typeof(PaymentStatusJsonConverter))]
public enum PaymentStatus
{
    Pending = 1,
    Paid = 2
}

public class PaymentStatusJsonConverter : JsonConverter<PaymentStatus>
{
    public override PaymentStatus Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Number)
        {
            var intVal = reader.GetInt32();
            if (Enum.IsDefined(typeof(PaymentStatus), intVal))
            {
                return (PaymentStatus)intVal;
            }
        }
        else if (reader.TokenType == JsonTokenType.String)
        {
            var strVal = reader.GetString()?.Trim().ToLowerInvariant();
            return strVal switch
            {
                "pending" or "pendiente" or "1" => PaymentStatus.Pending,
                "paid" or "pagado" or "2" => PaymentStatus.Paid,
                _ => throw new JsonException($"Estado de pago no válido: '{strVal}'. Valores permitidos: pendiente (1) o pagado (2).")
            };
        }

        throw new JsonException("Tipo de dato no válido para el estado de pago.");
    }

    public override void Write(Utf8JsonWriter writer, PaymentStatus value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value == PaymentStatus.Pending ? "pendiente" : "pagado");
    }
}
